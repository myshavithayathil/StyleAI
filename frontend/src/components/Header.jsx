import "./Header.css";

function Header({
  logoRoute = "/",
  variant = "action",
  stepText = "",
  buttonText = "Back to Dashboard",
  buttonRoute = "/dashboard",
  onButtonClick,
  sticky = false,
}) {
  const handleLogoClick = () => {
    window.location.href = logoRoute;
  };

  const handleActionClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonRoute) {
      window.location.href = buttonRoute;
    }
  };

  return (
    <header className={`app-header ${sticky ? "sticky" : ""}`}>
      <div
        className="app-logo"
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleLogoClick();
        }}
      >
        STYLE<span>AI</span>
      </div>

      {variant === "home" && (
        <div className="home-nav-links">
          <a href="#how">How It Works</a>
          <a href="#features">Features</a>
          <button
            className="header-nav-btn"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Dashboard
          </button>
        </div>
      )}

      {variant === "step" && (
        <div className="step-indicator">{stepText}</div>
      )}

      {variant === "action" && buttonText && (
        <button
          className="header-nav-btn"
          onClick={handleActionClick}
        >
          {buttonText}
        </button>
      )}
    </header>
  );
}

export default Header;
