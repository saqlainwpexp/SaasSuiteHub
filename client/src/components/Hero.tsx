import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToTools = () => {
    const toolsSection = document.getElementById("tools");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-neutral sm:text-5xl">
          <span className="block">All the tools you need</span>
          <span className="block text-primary">in one place</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          40 powerful web tools to boost your productivity. No fluff, just functionality.
        </p>
        <div className="mt-8">
          <Button 
            onClick={scrollToTools}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white"
          >
            Explore Tools
          </Button>
        </div>
      </div>
    </section>
  );
}
