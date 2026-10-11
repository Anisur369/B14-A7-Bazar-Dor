import CategoryDetails from "@/components/CategoryDetails";

const CategoryDetailsPage = async ({ params }) => {
  const { slug } = await params;
  return (
    <>
        <CategoryDetails categorySlug={slug} />
    </>
  );
};

export default CategoryDetailsPage;