import React from "react";

const videosData = [
  {
    id: 1,
    title: "Managing Anxiety Effectively",
    description: "Learn techniques to manage anxiety and regain control.",
    youtubeId: "Lv1jpqkN4ZY",
  },
  {
    id: 2,
    title: "Understanding Mental Health",
    description: "A clear explanation of mental health awareness.",
    youtubeId: "sfSDQRdIvTc",
  },
  {
    id: 3,
    title: "Mindfulness & Inner Peace",
    description: "Improve focus and calmness with mindfulness practices.",
    youtubeId: "TEwoWxLwCfA",
  },
  {
    id: 4,
    title: "Overcoming Stress Naturally",
    description: "Simple stress-relief techniques for daily life.",
    youtubeId: "pOkwgTcSXOY",
  },
  {
    id: 5,
    title: "Emotional Well-being Tips",
    description: "Habits that support emotional balance.",
    youtubeId: "YRJ6xoiRcpQ",
  },
  {
    id: 6,
    title: "Guided Relaxation Session",
    description: "Relax your mind and body with guided techniques.",
    youtubeId: "duyWh6hjKZg",
  },
];

const Videos = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-emerald-400">
          Mental Health Videos
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Watch expert-led videos to learn about mental health, relaxation,
          mindfulness, and emotional well-being.
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videosData.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            {/* Video */}
            <div className="relative w-full pb-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Videos;
