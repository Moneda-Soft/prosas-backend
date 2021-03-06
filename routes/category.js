const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { getCategory, getCategories, newCategory, updateCategory, deleteCategory } = require('../controllers/category');
const { existeCategoriaId, existeCategoriaNombre} = require('../helpers/db-validators');
const { isDate } = require('../helpers/date-validators');

const router = Router();


/**
 *              {{url}}/api/category
 */


//obtener todas las Categorias -- publico (get) 
router.get('/', [
    check('limit', 'Parametro limit debe ser numerico').isNumeric().optional({nullable: true}),
    check('from', 'Parametro from debe ser numerico').isNumeric().optional({nullable: true}),
    validarCampos
], getCategories);

//obtener una categoria por id -- publico (get)
router.get('/:id', [
    check('id').custom( existeCategoriaId ),
    validarCampos
], getCategory);

//Todas las rutan de abajo validan JWT
router.use( validarJWT );

//crear categoria -- privado -- admin role(post)
router.post('/', [
    tieneRole('ADMIN_ROLE'),
    check('name', 'El campo name es obligatorio').not().isEmpty(),
    check('lastModified').custom( isDate ),
    validarCampos  
], newCategory);

//actualizar una categoria por id -- privado -- admin role(put)
router.put('/:id', [
    tieneRole('ADMIN_ROLE'),
    check('id').custom( existeCategoriaId ),
    check('name','El campo name es obligatorio').not().isEmpty(),
    check('name').custom( existeCategoriaNombre ),
    check('lastModified').custom( isDate ),
    validarCampos
], updateCategory);

//borrar una categoria por id -- privado -- admin role(delete)
router.delete('/:id', [
    tieneRole('ADMIN_ROLE'),
    check('id').custom( existeCategoriaId ),
    validarCampos
], deleteCategory);


module.exports = router;