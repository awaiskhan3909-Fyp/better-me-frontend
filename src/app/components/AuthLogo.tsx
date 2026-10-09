import { Link } from "react-router";
import logo from "../../imports/Better_me_Logo.png";

interface AuthLogoProps {
  subtitle?: string;
  showSubtitle?: boolean;
}

export default function AuthLogo({ subtitle, showSubtitle = false }: AuthLogoProps) {
  return (
    <Link to="/" className="flex items-center justify-center mb-8">
      <img src={logo} alt="Better Me" className="h-12 object-contain" />
    </Link>
  );
}



