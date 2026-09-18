import { useLocation } from 'react-router-dom';

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <main className="grid min-h-[100dvh] place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="mono text-muted-foreground">404</p>
        <h1 className="display mt-4 text-4xl font-semibold md:text-5xl">This page does not exist</h1>
        <p className="mono mt-4 break-all text-muted-foreground">{pathname}</p>
        <a
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-px"
        >
          Back to the portfolio
        </a>
      </div>
    </main>
  );
};

export default NotFound;
