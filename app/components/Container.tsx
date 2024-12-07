'use client';

interface ContainterProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainterProps> = ({ children }) => {
  return (
    <div
      className="
        max-w-[2520px]
        mx-auto
        xl:px-20
        md:px-10
        sm:px-2
        px-4
        flex
        justify-end" // Added flex and justify-end for right alignment
    >
      {children}
    </div>
  );
};

export default Container;
 