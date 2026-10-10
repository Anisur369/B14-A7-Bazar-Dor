import ProductDetails from "@/components/ProductDetails";

const Peyaj = async ({ params }) => {
  const { id } = await params;
  return (
    <>
        <ProductDetails slug={id} />
    </>
  );
};

export default Peyaj;