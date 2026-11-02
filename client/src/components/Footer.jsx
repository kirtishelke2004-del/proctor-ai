const Footer = () => {
  return (
    <footer className="no-print mt-auto w-full py-6 px-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
          &copy; {new Date().getFullYear()} Proctor AI. Built with React.js, Node.js, Express, MongoDB &amp; Tailwind CSS.
        </p>
        <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            ● Proctor Engine Active
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
