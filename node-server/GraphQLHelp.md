# GraphQL Help and Notes

## Info object in resolvers

The info object holds all kinds of information about the query. 

`info.fieldNodes Array` Holds all the top level query objects

In order to see which fields were requested you need to find the correct field node for your query and then iterate over: 

`info.fieldNodes[i].selectionSet.selection` Array and check all `name.value` parameters.

