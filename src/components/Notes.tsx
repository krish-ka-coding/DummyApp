import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface NotesProps {
  onClose: () => void;
  triggerIsland: (left: string, center: string, right: string) => void;
}

export default function Notes({ onClose, triggerIsland }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('rn_notes');
      if (stored) {
        setNotes(JSON.parse(stored));
      } else {
        // Pre-seed some default notes if empty
        const defaults: Note[] = [
          {
            id: '1',
            title: 'Project Ideas',
            content: '1. Build an iOS Simulator mock app\n2. Research modern CSS glassmorphism\n3. Create custom widget layers',
            date: new Date().toLocaleDateString()
          },
          {
            id: '2',
            title: 'Shopping List',
            content: '- Organic apples\n- Green tea packets\n- Almond milk\n- Multi-grain bread',
            date: new Date().toLocaleDateString()
          }
        ];
        setNotes(defaults);
        await AsyncStorage.setItem('rn_notes', JSON.stringify(defaults));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveNote = async () => {
    if (!noteTitle.trim() && !noteContent.trim()) {
      setIsEditMode(false);
      setActiveNoteId(null);
      return;
    }

    try {
      let updatedNotes = [...notes];
      const existingIdx = notes.findIndex(n => n.id === activeNoteId);
      const dateStr = new Date().toLocaleDateString();

      const noteData: Note = {
        id: activeNoteId || Date.now().toString(),
        title: noteTitle.trim() || 'Untitled Note',
        content: noteContent,
        date: dateStr
      };

      if (existingIdx > -1) {
        updatedNotes[existingIdx] = noteData;
      } else {
        updatedNotes.push(noteData);
      }

      setNotes(updatedNotes);
      await AsyncStorage.setItem('rn_notes', JSON.stringify(updatedNotes));
      triggerIsland('📝', 'Note Saved Successfully', '✓');
    } catch (e) {
      console.error(e);
    }

    setIsEditMode(false);
    setActiveNoteId(null);
  };

  const openNewNote = () => {
    setActiveNoteId(Date.now().toString());
    setNoteTitle('');
    setNoteContent('');
    setIsEditMode(true);
  };

  const openExistingNote = (note: Note) => {
    setActiveNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsEditMode(true);
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const filtered = notes.filter(n => n.id !== id);
              setNotes(filtered);
              await AsyncStorage.setItem('rn_notes', JSON.stringify(filtered));
              triggerIsland('🗑', 'Note Deleted', '');
            } catch (e) {
              console.error(e);
            }
          }
        }
      ]
    );
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  if (isEditMode) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={saveNote} style={styles.backBtn}>
            <Text style={styles.backText}>✕ Notes</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Note</Text>
          <TouchableOpacity onPress={saveNote} style={styles.doneBtn}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editBody}>
          <TextInput
            style={styles.editTitleInput}
            value={noteTitle}
            onChangeText={setNoteTitle}
            placeholder="Title"
            placeholderTextColor="#8e8e93"
            autoFocus
          />
          <TextInput
            style={styles.editContentInput}
            value={noteContent}
            onChangeText={setNoteContent}
            placeholder="Start typing..."
            placeholderTextColor="#8e8e93"
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notes</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.largeTitle}>Notes</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#8e8e93"
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <TouchableOpacity style={styles.item} onPress={() => openExistingNote(item)}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.itemDate}>{item.date}</Text>
                  <Text style={styles.itemPreview} numberOfLines={1}>
                    {item.content.split('\n')[0] || 'No additional text'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteNote(item.id)}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Notes Found</Text>
          }
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.countText}>{notes.length} Notes</Text>
        <TouchableOpacity style={styles.newNoteBtn} onPress={openNewNote}>
          <Text style={styles.newNoteText}>📝 New Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#ff9f0a',
    fontSize: 16,
    fontWeight: '600',
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: '#ff9f0a',
    fontSize: 16,
    fontWeight: '500',
  },
  doneBtn: {
    padding: 8,
  },
  doneText: {
    color: '#ff9f0a',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 10,
  },
  searchBar: {
    height: 38,
    backgroundColor: '#f2f2f7',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
  },
  listContent: {
    backgroundColor: '#f2f2f7',
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
    backgroundColor: '#f2f2f7',
  },
  item: {
    flex: 1,
    padding: 14,
    paddingHorizontal: 18,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  itemMeta: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  itemDate: {
    fontSize: 13,
    color: '#8e8e93',
  },
  itemPreview: {
    flex: 1,
    fontSize: 13,
    color: '#8e8e93',
  },
  deleteBtn: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#8e8e93',
  },
  footer: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    backgroundColor: '#f2f2f7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  countText: {
    fontSize: 13,
    color: '#8e8e93',
  },
  newNoteBtn: {
    padding: 8,
  },
  newNoteText: {
    color: '#ff9f0a',
    fontSize: 15,
    fontWeight: '600',
  },
  editBody: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  editTitleInput: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
    paddingBottom: 8,
  },
  editContentInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
});
