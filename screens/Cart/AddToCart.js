import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

//    handleAddToCart(selectedItem, quantity, setQuantity, closeItemDetails , selectedItem.code);
export const handleAddToCart = async (selectedItem, quantity, setQuantity, closeItemDetails , code , price , sellerId,imageUri) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      // Optionally, show a user-friendly alert or message here
      return;
    }

    const cartUserRef = doc(db, 'CartUser', user.uid);
    const cartUserSnapshot = await getDoc(cartUserRef);

    // Create a new cart document if it does not exist
    if (!cartUserSnapshot.exists()) {
      await setDoc(cartUserRef, { createdAt: Timestamp.now() });
    }

    // Reference to the 'items' collection within the cart document
    const itemsCollectionRef = collection(cartUserRef, 'items');


    //
    // Add a new document for the selected item
    await addDoc(itemsCollectionRef, {
      itemName: selectedItem.name,
      quantity: quantity,
      status: 'pending',     
      timestamp: Timestamp.now(),    
      ItemCode: code,  
      UnitPrice : price ,
      Sellerid : sellerId,
      ImageUri :imageUri
    });

    // Reset quantity to default (e.g., 1)
    setQuantity(1);
    
    // Close the item details view
    closeItemDetails();
  } catch (error) {
    console.error('Error adding item to cart:', error);
    // Optionally, show a user-friendly alert or message here
  }
};
