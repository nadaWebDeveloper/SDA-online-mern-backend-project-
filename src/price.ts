// import { Product } from "./models/product"

// export const prices =
// [
//     {id: 0, name: 'Any' ,range: []},
//     {id: 1, name: '0 RS to 99 RS' ,range: [0, 99]},
//     {id: 2, name: '100 RS to 199 RS ' ,range: [100, 199]},
//     {id: 3, name: '200 RS to 399 RS ' ,range: [200 , 399]},
//     {id: 4, name: '400 RS to 699 RS' ,range: [400 , 699]},
//     {id: 5, name: 'More than 1000 RS' ,range: [1000 , Number.MAX_SAFE_INTEGER]},

// ]


// export const priceFilter = [
// {price :{$gte :0}},{price :{$lte : 99}},
// { $range: [ 0, 99 ] },
// { $range: [ 100, 199 ] },
// { $range: [ 200, 399 ] },
// { $range: [ 400, 699 ] },
// { $range: [ 1000, Number.MAX_SAFE_INTEGER ] }
// ]

// const sort = $match: { createdAt: { '$gt': new Date('2020-07-27T16:00:00.000Z'), '$lt': new Date('2020-07-28T15:59:59.000Z') } }

// Product.find({'createAt' : {$}})