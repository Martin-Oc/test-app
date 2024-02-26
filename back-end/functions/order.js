const jwt = require('jsonwebtoken');
const fs = require('fs')
const { join } = require('path');
let items = require('../../data/json-data/items.json')
const { getbase64Images } = require('./getItem');


const createPost = (request, response) => {
    const { id, item, address, shipping, date } = request.body

    let userID = undefined
    if (request.headers.authorization) {
        const token = request.headers.authorization.split(' ')[1]
        if (token !== 'undefined') {
            const user = jwt.decode(token, process.env.JWT_SECRET)
            userID = user.idUsers
        }
    }

    if (id == null | undefined || item == null | undefined || address == null | undefined || shipping == null | undefined || date == null | undefined) {
        return response.status(400).json({ msg: 'Wrong request!' })
    }

    let data =fs.readFileSync(join(process.cwd(), 'data', 'json-data', 'orders.json'), 'utf8');
    let originalJson
    
    if (!data){
        originalJson = []
    }else{
        originalJson = JSON.parse(data)
    }

    const allItems = item.map((element) => {
        return { idItems: element.idItems, amount: element.amount }
    })

    originalJson.push({
        orderId: Number(id),
        item: JSON.stringify(allItems),
        address: JSON.stringify(address),
        shipping: JSON.stringify(shipping),
        userID: JSON.stringify(userID) || undefined,
        date: JSON.stringify(date),
    })

    fs.writeFile(join(process.cwd(), 'data', 'json-data', 'orders.json'), JSON.stringify(originalJson), error => {
        if (error) {
            return response.status(500).json({ msg: 'Something went wrong' });
        }
        // If file write is successful, send the response
        response.status(201).json("Order was done successfully!");
    })
}

const getOrders = async (request, response) => {
    const token = request.headers.authorization.split(' ')[1]
    let userID = null
    let userOrders
    if (token !== 'undefined') {
        const user = jwt.decode(token, process.env.JWT_SECRET)
        userID = user.idUsers
    }

    let originalJson = fs.readFileSync(join(process.cwd(), 'data', 'json-data', 'orders.json'), 'utf8');

    if(!originalJson){
        return response.status(200).json([])
    }

    userOrders = JSON.parse(originalJson).filter((item) => item.userID == userID)

    //get all items
    let allItems = getbase64Images(items)

    const totalItems = userOrders.map(element => {
        const item = JSON.parse(element.item)
        //replace original item with new  
        element.item = createArrayWithMatchingIDs(item, allItems)
        return element
    })

    return response.status(200).json(totalItems)
}

function createArrayWithMatchingIDs(elements, orders) {
    // Map elements array to an object for easier lookup
    const elementsMap = elements.reduce((map, element) => {
        map[element.idItems] = element;
        return map;
    }, {});

    // Iterate over orders and retrieve matching elements
    const result = orders.map(order => {
        const element = elementsMap[order.idItems];
        if (element) {
            return { ...element, ...order };
        }
        return null;
    }).filter(Boolean); // Remove null values if any

    return result;
}

module.exports = { createPost, getOrders }