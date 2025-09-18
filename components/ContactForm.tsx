export default function ContactForm() {
  return (
    <section id="contact" className="p-10 text-center">
      <h3 className="text-3xl font-semibold mb-6">Contact Us</h3>
      <form className="space-y-4 max-w-md mx-auto">
        <input type="text" placeholder="Your Name" className="w-full p-2 rounded" />
        <input type="email" placeholder="Your Email" className="w-full p-2 rounded" />
        <textarea placeholder="Message" className="w-full p-2 rounded"></textarea>
        <button className="bg-purple-600 px-4 py-2 rounded text-white">
          Send
        </button>
      </form>
    </section>
  );
}
