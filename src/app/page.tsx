"use client"

import { socket } from "@/services/utils";
import dynamic from "next/dynamic";
import { FC, useCallback, useEffect, useRef, useState } from "react";
const ReactJson = dynamic(() => import('react-json-view'));


const Home: FC = () => {
  const [loading, setLoading] = useState(true);
  const [connectionLogs, setConnectionLogs] = useState<any>(["Connecting to Backend..."]);
  const [logs, setLogs] = useState<any>([]);

  const handleTrade = useCallback(async () => {
    socket?.emit("perform-transaction");
    setLogs([]);
    setLoading(true);
  }, []);

  useEffect(() => {

    socket?.on("connect", () => {
      setLoading(false);
      setConnectionLogs((l: any) => [...l, "Connected to Backend..."]);
      socket?.removeAllListeners();
      socket?.on("transaction-status", (data: any) => {
        if (data?.completed) setLoading(false);
        else setLogs((_logs: any) => [..._logs, data]);
      });
    });

    socket?.on("error", () => {
      setConnectionLogs((l: any) => [...l, "Error connecting to the socket, try refreshing the page"]);
      setLoading(true);
    });

    socket?.on("disconnect", () => setLoading(false));

  }, [])

  return (
    <div className="min-h-screen min-w-screen">
      <div className="flex flex-col items-center h-screen bg-white w-full md:px-24">
        <div className="flex flex-col justify-between w-full bg-gray-200 h-full md:w-4/5 p-5">
          <div className="w-auto flex flex-col justify-center">
            <img src="/icon.png" className="h-12 w-12 object-contain" />
          </div>
          <div className="flex-1 p-10 overflow-hidden">
            <div className="bg-gray-300 w-full h-full overflow-auto rounded-lg">
              <div className="w-full" />
              {connectionLogs.map((l: any) => <div key={l} className="pt-1">{l} </div>)}
              {
                logs.map((l: any) => <div key={l} className="pt-1">
                  {typeof l === "string" ?
                    l
                    :
                    <ReactJson
                      key={l}
                      displayDataTypes={false}
                      shouldCollapse={false}
                      enableClipboard={false}
                      src={l} />}
                </div>)
              }
            </div>
          </div>
          <div className="text-end">
            <button
              onClick={handleTrade}
              disabled={loading}
              className="bg-blue-500 disabled:bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded">
              Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Home;