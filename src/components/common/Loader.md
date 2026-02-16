# Componente Loader

Componente global y reutilizable para mostrar estados de carga en la aplicación.

## Importación

```tsx
import { Loader } from "@/components/common";
```

## Propiedades

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Tamaño del spinner |
| `text` | `string` | `"Cargando..."` | Texto que se muestra debajo del spinner |
| `fullScreen` | `boolean` | `false` | Si es `true`, el loader ocupa toda la pantalla con overlay |
| `className` | `string` | `""` | Clases CSS adicionales |

## Ejemplos de Uso

### Loader básico (inline)

```tsx
import { Loader } from "@/components/common";

function MiComponente() {
  return (
    <div>
      <Loader />
    </div>
  );
}
```

### Loader con texto personalizado

```tsx
<Loader text="Cargando datos..." />
```

### Loader en pantalla completa

Ideal para cuando toda la aplicación está cargando:

```tsx
import { Loader } from "@/components/common";
import { useState, useEffect } from "react";

function MiPagina() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    fetchData().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loader fullScreen size="lg" text="Cargando página..." />;
  }

  return <div>Contenido de la página</div>;
}
```

### Loader con tamaños diferentes

```tsx
// Pequeño
<Loader size="sm" text="Guardando..." />

// Mediano (por defecto)
<Loader size="md" text="Cargando..." />

// Grande
<Loader size="lg" text="Procesando..." />

// Extra grande
<Loader size="xl" text="Importando datos..." />
```

### Loader en un contenedor específico

```tsx
function TablaConCarga() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader size="md" text="Cargando tabla..." />
      </div>
    );
  }

  return <Tabla data={data} />;
}
```

### Loader con clases personalizadas

```tsx
<Loader 
  size="lg" 
  text="Procesando archivo..." 
  className="my-8"
/>
```

### Loader sin texto

```tsx
<Loader text="" />
```

## Casos de Uso Comunes

### 1. Carga inicial de página

```tsx
function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    cargarDatos()
      .then(setDatos)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loader fullScreen size="lg" text="Cargando dashboard..." />;
  }

  return <div>{/* Contenido del dashboard */}</div>;
}
```

### 2. Carga de sección específica

```tsx
function SeccionPerfil() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="border rounded-lg p-6">
      {isLoading ? (
        <Loader size="md" text="Cargando perfil..." />
      ) : (
        <PerfilUsuario />
      )}
    </div>
  );
}
```

### 3. Durante una operación asíncrona

```tsx
function FormularioGuardar() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await guardarDatos();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {isSaving && <Loader fullScreen text="Guardando cambios..." />}
      <form onSubmit={handleSubmit}>
        {/* Formulario */}
      </form>
    </>
  );
}
```

### 4. En un modal o diálogo

```tsx
function ModalConCarga() {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        {isProcessing ? (
          <div className="py-8">
            <Loader size="md" text="Procesando solicitud..." />
          </div>
        ) : (
          <div>{/* Contenido del modal */}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

## Características

- ✅ **Animación suave**: Usa el icono Loader2 de lucide-react con animación de spin
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Overlay**: Modo fullScreen con backdrop blur para bloquear interacciones
- ✅ **Personalizable**: Tamaños, textos y clases CSS personalizables
- ✅ **Accesible**: Incluye texto descriptivo para lectores de pantalla
- ✅ **Reutilizable**: Exportado desde un index central para fácil importación

## Notas

- El loader usa las clases de Tailwind CSS para estilos
- El color del spinner se adapta al tema usando `text-primary`
- El texto tiene una animación de pulse para mejor feedback visual
- En modo `fullScreen`, el loader tiene z-index de 50 para estar por encima de otros elementos