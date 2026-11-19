import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import ErrorPage from "@/errorPage/ErrorPage";
import Loader from "@/components/loader/Loader";
import { getRouteById, Routes } from "@/root/routes";
import { fetchLeaseIdentifierById } from "@/leases/requestsAsync";

const LeaseIdRedirectPage: React.FC = () => {
  const { leaseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!leaseId) {
      setNotFound(true);
      return;
    }

    fetchLeaseIdentifierById(leaseId)
      .then((identifier) => {
        navigate(
          {
            pathname: `${getRouteById(Routes.LEASE)}/${identifier}`,
            search: location.search,
            hash: location.hash,
          },
          { replace: true },
        );
      })
      .catch(() => setNotFound(true));
  }, [leaseId, location.hash, location.search, navigate]);

  if (notFound) {
    return <ErrorPage />;
  }

  return <Loader isLoading />;
};

export default LeaseIdRedirectPage;
