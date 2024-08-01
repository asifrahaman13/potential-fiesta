export default function Page({ params }: { params: { slug: string } }) {
  return <div>patient id {params.slug}</div>
}