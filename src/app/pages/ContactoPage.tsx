import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export function ContactoPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl mb-8 text-[#c70fff]">Contacto</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[rgba(199,15,255,0.15)]">
            <h2 className="text-2xl mb-6 text-[#c70fff]">Envíanos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-[rgba(199,15,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c70fff]"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-[rgba(199,15,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c70fff]"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Mensaje</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-[rgba(199,15,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c70fff]"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#c70fff] text-white py-3 rounded-lg hover:bg-[#a800d9] transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[rgba(199,15,255,0.15)]">
              <h2 className="text-2xl mb-6 text-[#c70fff]">Información</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-[#c70fff] mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">hola@y2kvault.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-[#c70fff] mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Teléfono</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#c70fff] mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Dirección</p>
                    <p className="text-gray-600">123 Fashion Street, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[rgba(199,15,255,0.15)]">
              <h2 className="text-xl mb-4 text-[#c70fff]">Síguenos</h2>
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-[rgba(199,15,255,0.08)] hover:bg-[#c70fff] text-[#c70fff] hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-[rgba(199,15,255,0.08)] hover:bg-[#c70fff] text-[#c70fff] hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-[rgba(199,15,255,0.08)] hover:bg-[#c70fff] text-[#c70fff] hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
