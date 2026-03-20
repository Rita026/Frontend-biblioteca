import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LogEntry {
  id: number;
  log: string;
}

const MOCK_LOGS: LogEntry[] = [
  {
    id: 10460,
    log: "El usuario J.Perez actualizó el inventario del ítem A82K19L el 12/01/2026 a las 08:15:23.",
  },
  {
    id: 10461,
    log: 'El usuario A.gonzalez cambió el título de "Redes" a "Redes Neuronales" el 12/01/2026 a las 09:42:10.',
  },
  {
    id: 10462,
    log: 'El usuario j.perez modificó el estado del libro C30P2WZ a "Reservado" el 12/01/2026 a las 10:05:45.',
  },
  {
    id: 10463,
    log: "El usuario a.gonzalez editó el campo de Autor en el registro D51R8YT el 12/01/2026 a las 11:30:12.",
  },
  {
    id: 10464,
    log: 'El usuario j.perez eliminó la etiqueta "Novedad" del ítem B7X94MQ el 13/01/2026 a las 14:22:05.',
  },
  {
    id: 10465,
    log: "El usuario a.gonzalez actualizó el precio de venta del libro F47H2KJ el 13/01/2026 a las 15:10:33.",
  },
  {
    id: 10466,
    log: "El usuario j.perez agregó una nota interna al pedido #4521 el 13/01/2026 a las 16:45:50.",
  },
  {
    id: 10467,
    log: "El usuario a.gonzalez modificó el ISBN del registro G12M6DV por error tipográfico el 14/01/2026 a las 09:12:18.",
  },
  {
    id: 10468,
    log: 'El usuario j.perez cambió la categoría de "Ciencia" a "Divulgación" el 14/01/2026 a las 10:55:29.',
  },
  {
    id: 10469,
    log: "El usuario a.gonzalez restauró el ítem H85T4XC desde la papelera el 14/01/2026 a las 13:08:44.",
  },
  {
    id: 10470,
    log: 'El usuario j.perez marcó el libro K42W9XP como "Dañado" el 15/01/2026 a las 08:33:15.',
  },
  {
    id: 10471,
    log: "El usuario a.gonzalez subió una nueva imagen de portada para L93Q5ZR el 15/01/2026 a las 11:19:02.",
  },
  {
    id: 10472,
    log: "El usuario j.perez actualizó la ubicación física del estante A1 al B3 el 15/01/2026 a las 14:40:56.",
  },
  {
    id: 10473,
    log: "El usuario a.gonzalez modificó el total de ejemplares disponibles de 10 a 8 el 16/01/2026 a las 09:25:30.",
  },
  {
    id: 10474,
    log: "El usuario a.gonzalez modificó el total de ejemplares disponibles de 10 a 12 el 16/01/2026 a las 09:25:30.",
  },
  {
    id: 10475,
    log: "El usuario a.gonzalez modificó el total de ejemplares disponibles de 9 a 10 el 16/01/2026 a las 09:25:30.",
  },
];

const renderLogMessage = (message: string) => {
  // Expresión regular para separar "El usuario", el "nombre de usuario", y el resto del mensaje
  const match = message.match(/^(El usuario\s+)(\S+)(\s+.*)$/i);
  if (match) {
    return (
      <>
        {match[1]}
        <span className="text-green-600">{match[2]}</span>
        {match[3]}
      </>
    );
  }
  return message;
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);

        // TODO: colocar el endpoint real cuando esté listo
        // const res = await fetch("http://localhost:3000/api/actividades");
        // const data = await res.json();

        // Simulando carga de datos con timeout
        await new Promise((resolve) => setTimeout(resolve, 800));
        setLogs(MOCK_LOGS);
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
      <header className="sr-only">
        <h1 id="page-title" className="text-2xl font-bold tracking-tight">
          Actividad Reciente
        </h1>
        <p className="text-muted-foreground">
          Monitor de cambios en el sistema.
        </p>
      </header>

      <div className="bg-white rounded-md w-full">
        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center w-full min-h-[300px]">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-black"></div>
          </div>
        )}

        {/* SIN DATOS */}
        {!loading && logs.length === 0 && (
          <div className="flex justify-center items-center w-full min-h-[300px]">
            <p className="text-gray-500 text-center">
              No hay datos por el momento
            </p>
          </div>
        )}

        {/* CON DATOS */}
        {!loading && logs.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="w-[100px] text-black font-medium">
                  ID
                </TableHead>
                <TableHead className="text-black font-medium">Log</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="text-gray-700 py-4 font-normal">
                    {log.id}
                  </TableCell>
                  <TableCell className="text-gray-700 py-4 font-normal whitespace-normal">
                    {renderLogMessage(log.log)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
