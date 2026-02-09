"use client";

import { useEffect } from "react";

export default function GenerateTrigger({ reportId }: { reportId: string }) {
  useEffect(() => {
    fetch(`/api/report/${reportId}/generate`, {
      method: "POST",
    });
  }, [reportId]);

  return null;
}
