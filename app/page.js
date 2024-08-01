"use client";
import Image from "next/image";
import { useState,useEffect } from "react";
import {firestore} from "@/firebase"
import { Box,Button,Modal,Stack,TextField,Typography } from "@mui/material";
import {collection,deleteDoc,getDoc,getDocs,query, setDoc,doc} from "firebase/firestore"

export default function Home() {
  const [inventory,setInventory]=useState([]);
  const [open,setOpen]=useState(false);
  const [itemName,setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory=async()=>{
    const snapshot = query(collection(firestore,'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList=[];
    docs.forEach((doc)=>{
      inventoryList.push({
        name:doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList);
  }

  useEffect(()=>{
  updateInventory();
  },[])

  const removeItem=async(item)=>{
    const docRef = await doc(collection(firestore,"inventory"),item);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      const {quantity} = docSnap.data();
      if(quantity===1){
        await deleteDoc(docRef);
      }else{
        await setDoc(docRef,{quantity:quantity-1});
      }
    }
    await updateInventory();
  }

  const addItem = async (item)=>{
    const docRef = await doc(collection(firestore,"inventory"),item);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      const {quantity} = docSnap.data();
      await setDoc(docRef,{quantity:quantity+1});
    }else{
      await setDoc(docRef,{quantity:1});
    }
    await updateInventory();
  }

const handleOpen=()=>{setOpen(true)};
const handleClose=()=>{setOpen(false)};

const filteredInventory = inventory.filter(item =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
);
return (
    <>
      <Box width="100vw" p={1} bgcolor="#2A4747" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center"><Typography variant="h4" color="#61D095">Inventory Store</Typography>
      <Stack width="400px" direction="row">
       <Box width="100%" alignItems="center" display="flex" justifyContent="center" gap={1} color="#FFFFFF">
          <TextField
          variant="outlined"
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            style: { color: '#FFFFFF' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#FFFFFF',
              }
            },
          }}
        />
      <Button variant="contained" onClick={()=>{handleOpen()}}>Add New Item</Button>
      </Box>
      </Stack>
      </Box>
    <Box width="100vw" height="90vh"  display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2} bgcolor="#61D095">
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="40%" left="40%" width={400} bgcolor="white" border="2px slid #000" p={4} boxShadow={24} display="flex" flexDirection="column" gap={3} sx={{tranform:"translate(-50%,-50%)"}}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e)=>{setItemName(e.target.value)}}></TextField>
            <Button variant="outlined" onClick={()=>{addItem(itemName); setItemName(""); handleClose();}}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      
      <Box border="1px solid #333">
        <Box
        width="800px"
        height="100px"
        bgcolor="#E0BAD7"
        display="flex"
        alignItems="center"
        justifyContent="center"
        >
          <Typography variant="h2" color="#333">Inventory Items</Typography>
        </Box>
     <Stack width="800px" height="460px" spacing={0} overflow="auto">
      {filteredInventory.map(({name,quantity})=>(
        <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" p={5}>
         <Typography variant="h3" color="#333" textAlign="center">
          {name.charAt(0).toUpperCase() + name.slice(1)}
         </Typography>
         <Typography variant="h3" color="#333" textAlign="center">
          {quantity}
         </Typography>
         <Stack display="flex" flexDirection="column" gap={1}>
         <Button variant="contained" onClick={()=>{addItem(name);}}>Add</Button>
         <Button variant="contained" onClick={()=>{removeItem(name);}}>Remove</Button>
         </Stack>
        </Box>
      ))}
     </Stack>
      </Box>
    </Box>
    </>
  );
}
