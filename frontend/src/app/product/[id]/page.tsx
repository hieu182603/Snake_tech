import ProductDetailPage from '../ProductDetailPage';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetail({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProductDetailPage id={resolvedParams.id} />;
}
