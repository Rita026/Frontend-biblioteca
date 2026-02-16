import { useEffect, useState } from "react";

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);

        // TODO: coloca tu endpoint real cuando esté listo
        const res = await fetch("http://localhost:3001/logs");
        const data = await res.json();

        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando logs:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  return (
    <section aria-labelledby="page-title" className="space-y-6">
      <header>
        <h1 id="page-title" className="text-2xl font-bold tracking-tight">
          Actividad Reciente
        </h1>
        <p className="text-muted-foreground">Monitor de cambios en el sistema.</p>
      </header>

      <div className="rounded-md border p-4 min-h-[150px] flex items-center justify-center">
        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center w-full">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* SIN DATOS */}
        {!loading && logs.length === 0 && (
          <p className="text-gray-500 text-center w-full">
            No hay datos por el momento
          </p>
        )}

        {/* CON DATOS */}
        {!loading && logs.length > 0 && (
          <ul className="space-y-3 w-full">
            {logs.map((log, i) => (
              <li
                key={i}
                className="border-b pb-2 last:border-none text-sm text-gray-800"
              >
                {log.message || "Entrada sin mensaje"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
