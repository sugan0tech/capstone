export const Hero = () => {
  return (
    <div className="hero bg-base-200 h-fit">
      <div className="hero-content flex-col lg:flex-row">
        <img
          src="https://christcenteredmall.com/stores/art/hopkins/images/zooms/helping-hand-large-image-zoom.jpg"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">
            Be a hero in someone's life. Donate blood.
          </h1>
          <p className="py-6">
            "By donating blood, you become a hero in someone's life. Your single
            act of kindness can save lives in emergencies, support patients with
            chronic conditions, and ensure the well-being of mothers and
            newborns. Join us in making a difference—donate blood and be a hero
            today."
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
};
