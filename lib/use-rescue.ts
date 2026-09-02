'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { createStore, toolDefinitions } from './store';

type Context = {
 registerTool: (tool: unknown, options?: { signal: AbortSignal }) => void | Promise<void>;
 unregisterTool?: (name: string) => void;
};
export function useRescue() {
 const [store] = useState(createStore);
 const state = useSyncExternalStore(store.subscribe, store.get, store.initial);
 const [connection,setConnection] = useState<'checking'|'connected'|'unsupported'|'error'>('checking');
 useEffect(() => {
  store.hydrate();
  const context = (document as Document & {modelContext?:Context}).modelContext
   ?? (navigator as Navigator & {modelContext?:Context}).modelContext;
  if (!context?.registerTool) { setConnection('unsupported'); return; }
  const controller = new AbortController();
  let active = true;
  const names: string[] = [];
  Promise.all(toolDefinitions(store).map(async tool => {
   await context.registerTool({
    ...tool,
    execute: async (input: unknown) => {
     try {
      let result: unknown;
      flushSync(() => { result = tool.execute(input); });
      return {content: [{type:'text', text:JSON.stringify(result)}]};
     } catch (error) {
      return {isError:true, content:[{type:'text',text:JSON.stringify({error:error instanceof Error?error.message:'Action failed'})}]};
     }
    }
   }, {signal:controller.signal});
   if (active) names.push(tool.name);
   else context.unregisterTool?.(tool.name);
  })).then(() => { if (active) setConnection('connected'); })
    .catch(() => { if (active) setConnection('error'); });
  return () => {
   active = false;
   controller.abort();
   for (const name of names) context.unregisterTool?.(name);
  };
 }, [store]);
 return {store,state,connection};
}
