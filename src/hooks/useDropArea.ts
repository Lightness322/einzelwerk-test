import { useEffect, useRef, useState } from "react";

export function useDropArea(triggerRef: React.RefObject<HTMLElement>) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dropArea = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const dropAreaElem = dropArea.current!;
    const triggerElem = triggerRef.current!;

    function handleDragIn(e: DragEvent) {
      if (triggerElem.contains(e.target as Node)) {
        setIsDragging(true);
      }
    }

    function handleDragOut(e: DragEvent) {
      if (!triggerElem.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    }

    function handleDrop() {
      setIsDragging(false);
    }

    triggerElem.addEventListener("dragenter", handleDragIn);
    triggerElem.addEventListener("dragleave", handleDragOut);
    dropAreaElem.addEventListener("drop", handleDrop);

    return () => {
      triggerElem.removeEventListener("dragenter", handleDragIn);
      triggerElem.removeEventListener("dragleave", handleDragOut);
      dropAreaElem.removeEventListener("drop", handleDrop);
    };
  }, [triggerRef]);

  return { isDragging, dropArea };
}
