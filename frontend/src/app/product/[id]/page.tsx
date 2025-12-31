import ProductDetailPage from '@/pages/product/[id]';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductDetail({ params }: PageProps) {
  return <ProductDetailPage id={params.id} />;
}
