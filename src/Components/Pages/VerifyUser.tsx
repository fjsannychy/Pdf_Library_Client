import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthService } from "../../Services/authServices";

export const VerifyUser = () => {
  const { token } = useParams();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (token) {
      AuthService.Verify({ token: token})
        .then((resp: any) => setData(resp.data))
        .catch((err) => {
          console.error(err);
          setData("Verification Failed!");
        });
    }
  }, [token]);

  
  return (
    <div className="container mt-4">
      <div className="card p-4" style={{ maxWidth: 500, margin: "auto" }}>
        <h4 className="text-center mb-3">{data ? data : "Verify User Processing....."}</h4>
      </div>
    </div>
  );
};