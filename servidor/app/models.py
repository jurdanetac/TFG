from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TipoDeDoc(db.Model):
    """Modelo para los tipos de documentos. 1:N con Documentos"""

    __tablename__ = 'tipos_de_documentos'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String)
    valores_attrib = db.Column(db.JSON)

    documentos = db.relationship('Documentos', back_populates='tipo_de_documento')
    atributos = db.relationship('Atributos', back_populates='tipo_de_documento')


class Atributos(db.Model):
    """Modelo para los atributos de los tipos de documentos. N:1 con TipoDeDoc"""

    __tablename__ = 'atributos'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String)
    tipo_dato = db.Column(db.String)
    requerido = db.Column(db.Boolean)
    tipo_de_documento_id = db.Column(db.Integer, db.ForeignKey('tipos_de_documentos.id'))

    tipo_de_documento = db.relationship('TipoDeDoc', back_populates='atributos')


class Documentos(db.Model):
    """Modelo para los documentos. 1:1 con Bloques y N:1 con TipoDeDoc"""

    __tablename__ = 'documentos'
    id = db.Column(db.Integer, primary_key=True)
    creado_en = db.Column(db.DateTime)
    hash = db.Column(db.String)
    tipo_archivo = db.Column(db.String)
    contenido = db.Column(db.String)
    tipo_de_documento_id = db.Column(db.Integer, db.ForeignKey('tipos_de_documentos.id'))
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    bloque_id = db.Column(db.Integer, db.ForeignKey('bloques.id'))

    tipo_de_documento = db.relationship('TipoDeDoc', back_populates='documentos')
    usuario = db.relationship('Usuarios', back_populates='documentos')
    bloque = db.relationship('Bloques', back_populates='documentos')

    def __repr__(self):
        return f'<Documento {self.id}>'


class Usuarios(db.Model):
    """Modelo para los usuarios. 1:N con Documentos"""

    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String)
    hash_contrasena = db.Column(db.String)

    documentos = db.relationship('Documentos', back_populates='usuario')

    def __repr__(self):
        return f'<Usuario {self.id}>'


class Bloques(db.Model):
    """Modelo para los bloques. 1:1 con Documentos"""

    __tablename__ = 'bloques'
    id = db.Column(db.Integer, primary_key=True)
    creado_en = db.Column(db.DateTime)
    hash_previo = db.Column(db.String)
    hash = db.Column(db.String)
    relacionado_con_bloque_id = db.Column(db.Integer, db.ForeignKey('bloques.id'))

    documentos = db.relationship('Documentos', back_populates='bloque')
    relacionados = db.relationship('Bloques', backref='bloque_relacionado', remote_side=[id])

    def __repr__(self):
        return f'<Bloque {self.id}>'