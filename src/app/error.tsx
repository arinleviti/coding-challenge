"use client";

import { useEffect } from "react";
import { Alert, Button } from "react-bootstrap";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <Alert variant="danger">
        Failed to load products. Please try again.
      </Alert>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
