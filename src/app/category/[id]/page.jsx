import CategoryDetails from "@/components/CategoryDetails";

const CategoryDetailsPage = async ({ params }) => {
  const { id } = await params;
  return (
    <>
        <CategoryDetails categorySlug={id} />
    </>
  );
};

export default CategoryDetailsPage;