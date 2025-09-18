export default function Gallery() {
  return (
    <section id="gallery" className="p-10 text-center bg-gray-700">
      <h3 className="text-3xl font-semibold mb-6">Gallery</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-500 h-40">Image 1</div>
        <div className="bg-gray-500 h-40">Image 2</div>
        <div className="bg-gray-500 h-40">Image 3</div>
      </div>
    </section>
  );
}
