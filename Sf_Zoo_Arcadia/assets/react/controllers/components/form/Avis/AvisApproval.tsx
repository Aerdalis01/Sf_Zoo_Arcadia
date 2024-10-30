import React, {useState, useEffect} from "react";
import { useRoleActions } from "../../user-space/useRoleActions";

export const AvisApproval: React.FC = () => {
  const { handleApprove, handleReject, avis } = useRoleActions();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (avis.length > 0) {
      setIsLoaded(true);
    }
  }, [avis]);

  return (
    <div className={`avis-table ${isLoaded ? 'loaded' : ''}`}>
      <table className="table">
        <thead>
          <tr>
          <th>Nom</th>
            <th>Avis</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {avis.length > 0 ? (
            avis.map((item) => (
              <tr key={item.id}>
                <td>{item.nom}</td>
                <td>{item.avis}</td>
                <td>{item.note}</td>
                <td>
                  {!item.valid ? (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="btn btn-success"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="btn btn-danger"
                      >
                        Rejeter
                      </button>
                    </>
                  ) : (
                    <span>{item.valid ? 'Approuvé' : 'Rejeté'}</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Aucun avis trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};