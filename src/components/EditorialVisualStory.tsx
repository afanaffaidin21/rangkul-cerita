import Image from "next/image";

export function EditorialVisualStory() {
  return (
    <section className="bg-[#FAFBF8] py-16 lg:py-20" aria-labelledby="editorial-visual-story-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-5xl space-y-3 text-center">
          <h2 id="editorial-visual-story-title" className="text-2xl font-bold leading-tight text-[#173D30] sm:text-3xl lg:text-4xl font-sans">
            Tidak semua hal harus kamu hadapi sendirian.
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#35413A] sm:text-base">
            Mulai dengan memahami apa yang sedang kamu rasakan. Dari sana, kamu bisa memilih langkah kecil yang terasa mungkin—sendiri atau bersama seseorang yang kamu percaya.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)] md:grid-rows-[minmax(20rem,1fr)_minmax(18rem,1fr)] lg:gap-x-12 lg:gap-y-10">
          <div className="relative min-h-56 overflow-hidden rounded-3xl md:row-start-1 md:min-h-0">
            <Image
              src="/images/editorial-reflection.png"
              alt="Seseorang menulis dengan tenang di ruang yang hangat"
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 58vw, 58vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center md:row-start-1 md:px-3 lg:px-6">
            <h3 className="text-lg font-bold leading-tight text-[#173D30] sm:text-xl">
              Pahami apa yang sedang kamu rasakan.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#66736C] sm:text-base">
              Beri dirimu ruang untuk mengenali emosi, hal yang memicunya, dan apa yang mungkin sedang kamu butuhkan—tanpa harus buru-buru menemukan semua jawabannya.
            </p>
          </div>

          <div className="order-4 flex flex-col justify-center md:order-3 md:row-start-2 md:px-3 lg:px-6">
            <h3 className="text-lg font-bold leading-tight text-[#173D30] sm:text-xl">
              Lanjutkan dengan langkah yang terasa mungkin.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#66736C] sm:text-base">
              Tidak harus besar. Kamu bisa mencoba satu langkah kecil untuk dirimu sendiri, atau memilih berbicara dengan seseorang yang kamu percaya ketika rasanya lebih membantu.
            </p>
          </div>

          <div className="order-3 relative min-h-56 overflow-hidden rounded-3xl md:order-4 md:row-start-2 md:min-h-0">
            <Image
              src="/images/human-connection.png"
              alt="Dua orang berbicara dengan tenang dan saling memperhatikan"
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 42vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
