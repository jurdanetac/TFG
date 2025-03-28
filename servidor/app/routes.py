# routes.py
from flask import Blueprint, request, jsonify
from models import db, TipoDeDoc, Atributos, Documentos, Usuarios, Bloques
from datetime import datetime

bp = Blueprint('api', __name__)

@bp.route('/', methods=['GET'])
def index():
    return jsonify({"info": "API de gestión de documentos"})

@bp.route('/testear_esquema', methods=['GET'])
def testear_esquema():
    """Insertar info a todos los modelos"""

    # Crear un usuario
    usuario = Usuarios(nombre='Juan Perez', hash_contrasena='hashed_password')
    db.session.add(usuario)
    db.session.commit()

    # Crear un tipo de documento
    tipo_doc = TipoDeDoc(nombre='Factura', valores_attrib={"IVA": "21%"})
    db.session.add(tipo_doc)
    db.session.commit()

    # Crear atributos para el tipo de documento
    atributo1 = Atributos(nombre='Fecha', tipo_dato='Date', requerido=True, tipo_de_documento=tipo_doc)
    atributo2 = Atributos(nombre='Total', tipo_dato='Float', requerido=True, tipo_de_documento=tipo_doc)
    db.session.add(atributo1)
    db.session.add(atributo2)
    db.session.commit()

    # Crear un bloque
    bloque = Bloques(creado_en=datetime.now(), hash_previo='prev_hash', hash='current_hash')
    db.session.add(bloque)
    db.session.commit()

    # Crear un documento
    documento = Documentos(creado_en=datetime.now(), hash='doc_hash', tipo_archivo='pdf', contenido='contenido del documento', tipo_de_documento=tipo_doc, usuario=usuario, bloque=bloque)
    db.session.add(documento)
    db.session.commit()

    return jsonify({"message": "Datos de prueba insertados correctamente"})

@bp.route('/mostrar_prueba', methods=['GET'])
def mostrar_prueba():
    """Mostrar datos de prueba"""
    # Obtener todos los documentos
    documentos = Documentos.query.all()
    data = []
    for doc in documentos:
        data.append({
            "id": doc.id,
            "creado_en": doc.creado_en,
            "hash": doc.hash,
            "tipo_archivo": doc.tipo_archivo,
            "contenido": doc.contenido,
            "tipo_de_documento_id": doc.tipo_de_documento_id,
            "usuario_id": doc.usuario_id,
            "bloque_id": doc.bloque_id
        })
    return jsonify(data)