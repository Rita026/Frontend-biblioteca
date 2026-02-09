export default function ActivityPage() {
  return (
    // Usa <section> o <article> como contenedor principal de la vista
    <section aria-labelledby="page-title" className="space-y-6">
      <header>
        {/* Siempre un H1 único por página para SEO y lectores de pantalla */}
        <h1 id="page-title" className="text-2xl font-bold tracking-tight">
          Actividad Reciente
        </h1>
        <p className="text-muted-foreground">Monitor de cambios en el sistema.</p>
      </header>
      
      {/* Tu contenido aquí */}
      <div className="rounded-md border p-4">...</div>
    </section>
  );
}
