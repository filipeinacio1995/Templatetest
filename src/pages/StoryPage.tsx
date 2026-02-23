import { StorySection } from '../modules/ui/StorySection';

export const StoryPage = () => {
  return (
    // Removed the pt-20 padding to allow the StorySection to hit the top of the viewport immediately
    <div className="w-full"> 
      <StorySection />
    </div>
  );
};