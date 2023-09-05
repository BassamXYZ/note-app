from flask import Blueprint, request, jsonify
from flask_restful import Resource, Api

from . import db
from .models import Note
from .auth import token_required


notes = Blueprint('notes', __name__)
api = Api(notes)


class Notes(Resource):
    @token_required
    def get(current_user, self):

        notes_list = []

        for note in current_user.notes:
            notes_list.append({
                "id": note.id,
                "text": note.text,
                "date": note.date,
            })

        return jsonify(notes_list)

    @token_required
    def post(current_user, self):

        note = request.form['note']

        if len(note) < 1:
            return {"error": 'Note is too short!'}
        else:
            new_note = Note(text=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            return {'success': 'Note added'}, 200

    @token_required
    def patch(current_user, self):

        text = request.form['note']
        id = request.form['id']

        note = Note.query.get(id)

        if note.user_id == current_user.id:
            if len(text) < 1:
                return {"error": 'Note is too short!'}
            else:
                note.text = text
                db.session.commit()
                return {'success': 'Note updated'}, 200

    @token_required
    def delete(current_user, self):

        id = request.form['id']

        note = Note.query.get(id)

        if note:
            if note.user_id == current_user.id:
                db.session.delete(note)
                db.session.commit()

        return {'success': 'Note deleted'}, 200


api.add_resource(Notes, '/notes')
