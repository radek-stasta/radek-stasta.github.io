import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="flex flex-row rounded-2xl bg-surface shadow-md overflow-hidden max-w-2xl w-full">
        {/* Left column - photo */}
        <div className="w-1/3 shrink-0">
          <Image
            src="/images/myself.jpg"
            alt="Radek Šťasta"
            width={400}
            height={600}
            className="w-full h-auto"
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
              Hi. My name is Radek and I'm {currentDate.getFullYear() - birthday.getFullYear()} years old. Practically my whole life, I've been passionate about
              computers and whole IT world. That passion resulted in magister degree in Computer Science and then in all my professional career.
              Throughout the years, I have touched many different areas of IT, both as my professional and also personal interest.

              This website will serve as a hub for all my projects, ideas, articles and other content that I want to share with the world and also as
              my portfolio of my work. 
              
              Currently there is not much content here, but I will be adding more and more over time, so stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
