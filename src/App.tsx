import { useState, useCallback } from 'react';
import AppHeader from './components/AppHeader';
import QueryBar from './components/QueryBar';
import RequestEditor from './components/RequestEditor';
import ResponseViewer from './components/ResponseViewer';
import SampleQueriesSidebar from './components/SampleQueriesSidebar';
import HistoryPanel from './components/HistoryPanel';
import useApiRequest from './hooks/useApiRequest';
import useHistory from './hooks/useHistory';
import useVariables from './hooks/useVariables';
import { substituteVariables } from './hooks/useVariables';
import { resolvedSampleQueries, resolvedDefaultHeaders, resolvedBaseUrls } from './config/resolvedConfig';
import { API_BASE_URL } from './auth/authConfig';
import type { RequestState } from './types';

// Build the full list: env var first (if set and not already in the list), then configured URLs
const allBaseUrls = useMemoBaseUrls();
function useMemoBaseUrls() {
  const envUrl = API_BASE_URL;
  const hasEnv = resolvedBaseUrls.some((b) => b.url === envUrl);
  const list = hasEnv ? resolvedBaseUrls : [{ label: 'Default', url: envUrl }, ...resolvedBaseUrls];
  return list;
}

const initialRequest: RequestState = {
  method: 'GET',
  path: '/me',
  headers: [...resolvedDefaultHeaders],
  body: '',
};

export default function App() {
  const [request, setRequest] = useState<RequestState>(initialRequest);
  const [baseUrl, setBaseUrl] = useState(allBaseUrls[0].url);
  const { run, cancel, loading, response } = useApiRequest();
  const { entries, addEntry, removeEntry, clearHistory } = useHistory();
  const { variables, setVariable, addVariable, removeVariable } = useVariables();

  const patchRequest = useCallback(
    (patch: Partial<RequestState>) => setRequest((prev) => ({ ...prev, ...patch })),
    [],
  );

  const handleRun = async () => {
    const resolved: RequestState = {
      ...request,
      path: substituteVariables(request.path, variables),
      headers: request.headers.map((h) => ({
        ...h,
        key: substituteVariables(h.key, variables),
        value: substituteVariables(h.value, variables),
      })),
      body: substituteVariables(request.body, variables),
    };
    const result = await run(resolved, baseUrl);
    if (result) addEntry(request, result, resolved.path);
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SampleQueriesSidebar queries={resolvedSampleQueries} onSelect={patchRequest} />

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto">
          <QueryBar
            request={request}
            onChange={patchRequest}
            onRun={handleRun}
            onCancel={cancel}
            loading={loading}
            baseUrl={baseUrl}
            baseUrls={allBaseUrls}
            onBaseUrlChange={setBaseUrl}
          />
          <RequestEditor
            request={request}
            onChange={patchRequest}
            variables={variables}
            onSetVariable={setVariable}
            onAddVariable={addVariable}
            onRemoveVariable={removeVariable}
          />
          <ResponseViewer response={response} loading={loading} />
          <HistoryPanel entries={entries} onSelect={patchRequest} onRemove={removeEntry} onClear={clearHistory} />
        </main>
      </div>
    </div>
  );
}
