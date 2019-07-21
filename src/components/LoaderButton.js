import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "../styles/LoaderButton.css";

const loaderButton = ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
      {!isLoading ? text : loadingText}
    </Button>
  )
}

export default loaderButton;
