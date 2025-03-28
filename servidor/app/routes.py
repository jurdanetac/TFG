# routes.py
from flask import Blueprint, request, jsonify
from models import db, TipoDeDoc, Documentos, Usuarios, Bloques

bp = Blueprint('api', __name__)


@bp.route('/', methods=['GET'])
def index():
    return jsonify({"info": "API de gestión de documentos"})

"""
@bp.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()
    new_usuario = Usuarios(nombre=data['nombre'], hash_contrasena=data['hash_contrasena'])
    db.session.add(new_usuario)
    db.session.commit()
    return jsonify(new_usuario.id), 201


@bp.route('/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    usuario = Usuarios.query.get_or_404(id)
    return jsonify({'id': usuario.id, 'nombre': usuario.nombre})


@bp.route('/documentos', methods=['POST'])
def create_documento():
    data = request.get_json()
    new_documento = Documentos(
        creado_en=data['creado_en'],
        hash=data['hash'],
        tipo_archivo=data['tipo_archivo'],
        contenido=data['contenido'],
        tipo_de_doc_id=data['tipo_de_doc_id'],
        bloque_id=data['bloque_id']
    )
    db.session.add(new_documento)
    db.session.commit()
    return jsonify(new_documento.id), 201


@bp.route('/documentos/<int:id>', methods=['GET'])
def get_documento(id):
    documento = Documentos.query.get_or_404(id)
    return jsonify({
        'id': documento.id,
        'creado_en': documento.creado_en,
        'hash': documento.hash,
        'tipo_archivo': documento.tipo_archivo,
        'contenido': documento.contenido,
        'tipo_de_doc_id': documento.tipo_de_doc_id,
        'bloque_id': documento.bloque_id
    })


@bp.route('/tiposdedoc', methods=['POST'])
def create_tipo_de_doc():
    data = request.get_json()
    new_tipo_de_doc = TipoDeDoc(nombre=data['nombre'], valores_attrib=data['valores_attrib'])
    db.session.add(new_tipo_de_doc)
    db.session.commit()
    return jsonify(new_tipo_de_doc.id), 201


@bp.route('/tiposdedoc/<int:id>', methods=['GET'])
def get_tipo_de_doc(id):
    tipo_de_doc = TipoDeDoc.query.get_or_404(id)
    return jsonify({'id': tipo_de_doc.id, 'nombre': tipo_de_doc.nombre, 'valores_attrib': tipo_de_doc.valores_attrib})


@bp.route('/bloques', methods=['POST'])
def create_bloque():
    data = request.get_json()
    new_bloque = Bloques(creado_en=data['creado_en'], hash_previo=data['hash_previo'], hash=data['hash'])
    db.session.add(new_bloque)
    db.session.commit()
    return jsonify(new_bloque.id), 201


@bp.route('/bloques/<int:id>', methods=['GET'])
def get_bloque(id):
    bloque = Bloques.query.get_or_404(id)
    return jsonify(
        {'id': bloque.id, 'creado_en': bloque.creado_en, 'hash_previo': bloque.hash_previo, 'hash': bloque.hash})
"""
