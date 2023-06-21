import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react';

// partial reloads
export default function Products({ auth, products }) {
    const [allProducts, setAllProducts] = useState([]);
    console.log(products);

    useEffect(() => {
        setAllProducts(products.allProduct);
    }, [products]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-black leading-tight">Products</h2>}
        >
            <Head title="Products" />
            <div className="sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Images</th>
                                    <th>Price</th>
                                    <th>Publier</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allProducts?.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.title}</td>
                                    <td>{product.images}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <span className={`badge ${product.published == false ? "badge-purple" : "badge-blue"}`}>{product.published}</span>
                                    </td>
                                    <td className='actions flex'>
                                        <Link href={"/products/" + product.id} className="btn"><Icon icon="ph:eye" /></Link>
                                        <Link href="/products/create" className="btn"><Icon icon="ph:pencil-light" /></Link>
                                        <Link href="/" className="btn"><Icon icon="solar:trash-bin-2-outline" /></Link>
                                    </td>
                                </tr>
                            ))}

                            
                            </tbody>
                        </table>

                        { allProducts.length <= 0 && <div className='text-center p-2 text-gray-500'>Il n'y a aucun produit</div>}
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
