import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="flex flex-row rounded-2xl bg-surface shadow-md overflow-hidden max-w-2xl w-full">
        {/* Left column - photo */}
        <div className="w-1/3 shrink-0">
          <img
            src="images/myself.jpg"
            alt="Radek Šťasta"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right column - split into two rows */}
        <div className="flex flex-col flex-1 p-6">
          {/* Top row - site name */}
          <div className="flex-1 flex items-start">
            <h2 className="text-2xl font-bold">
              Radek Šťasta - Personal Website
            </h2>
          </div>

          {/* Bottom row - description */}
          <div className="flex-1 flex items-end">
            <p className="text-sm text-fg/70">
              Brief description about me and what I do goes here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
