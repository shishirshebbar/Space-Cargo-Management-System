import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GridCard = ({ title, icon: Icon, link }) => {
  return (
    <Link to={link} className="hover:scale-105 transition-transform">
      <Card className="w-48 h-48 flex flex-col justify-center items-center text-center shadow-md hover:shadow-lg">
        <CardHeader>
          {Icon && <Icon className="h-10 w-10 text-gray-700" />} {/* Ensure icon renders correctly */}
        </CardHeader>
        <CardContent>
          <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GridCard;
