import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" role="status" />
      <span className="ms-2">Loading products...</span>
    </div>
  );
}