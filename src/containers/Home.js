import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import Form from "react-bootstrap/Form";

export default function Home() {
    const { isAuthenticated } = useAppContext();
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const notesPerPage = 5;

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }
            try {
                const notes = await loadNotes();
                setNotes(notes);
<<<<<<< HEAD
                setFilteredNotes(notes); // Initialize filtered notes
=======
                setFilteredNotes(notes);
>>>>>>> 74533490aca3d8c574ad2b37a46c6bfc26fce5e0
            } catch (e) {
                onError(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, [isAuthenticated]);

    function loadNotes() {
        return API.get("notes", "/notes");
    }

    function handleSearch(event) {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = notes.filter((note) =>
            note.content.toLowerCase().includes(term) ||
            (note.attachment && typeof note.attachment === "string" && note.attachment.toLowerCase().includes(term))
        );

        setFilteredNotes(filtered);
<<<<<<< HEAD
        setCurrentPage(1); // Reset to the first page after search
=======
        setCurrentPage(1);
>>>>>>> 74533490aca3d8c574ad2b37a46c6bfc26fce5e0
    }

    function renderNotesList(notesToRender) {
        const indexOfLastNote = currentPage * notesPerPage;
        const indexOfFirstNote = indexOfLastNote - notesPerPage;
        const currentNotes = notesToRender.slice(indexOfFirstNote, indexOfLastNote);

        return (
            <>
                <LinkContainer to="/notes/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ml-2 font-weight-bold">Create a new note</span>
                    </ListGroup.Item>
                </LinkContainer>
<<<<<<< HEAD
                {currentNotes.map(({ noteId, content, createdAt, attachment }) => {
                    const imageUrl = attachment || "/default-image.png"; // Use default image if no attachment

                    return (
                        <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                            <ListGroup.Item action className="d-flex align-items-center">
                                <img
                                    src={imageUrl}
                                    alt={`Note ${content.trim().split("\n")[0]}`}
                                    className="note-image mr-3"
                                    onError={(e) => (e.target.src = "/default-image.png")} // Use default image if loading fails
                                />
                                <div>
                                    <span className="font-weight-bold">
                                        {content.trim().split("\n")[0]}
                                    </span>
                                    <br />
                                    <span className="text-muted">
                                        Created: {new Date(createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </ListGroup.Item>
                        </LinkContainer>
                    );
                })}
=======
                {currentNotes.map(({ noteId, content, createdAt }) => (
                    <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                        <ListGroup.Item action>
                            <span className="font-weight-bold">
                                {content.trim().split("\n")[0]}
                            </span>
                            <br />
                            <span className="text-muted">
                                Created: {new Date(createdAt).toLocaleString()}
                            </span>
                        </ListGroup.Item>
                    </LinkContainer>
                ))}
>>>>>>> 74533490aca3d8c574ad2b37a46c6bfc26fce5e0
            </>
        );
    }

    function renderPagination() {
        const totalNotes = filteredNotes.length;
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalNotes / notesPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination">
                <button
<<<<<<< HEAD
                    className="page-link"
                    disabled={currentPage === 1}
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
=======
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
>>>>>>> 74533490aca3d8c574ad2b37a46c6bfc26fce5e0
                >
                    &laquo;
                </button>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
<<<<<<< HEAD
                        className={`page-link ${number === currentPage ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(number);
                        }}
=======
                        className={number === currentPage ? "active" : ""}
                        onClick={() => setCurrentPage(number)}
>>>>>>> 74533490aca3d8c574ad2b37a46c6bfc26fce5e0
                    >
                        {number}
                    </button>
                ))}
                <button
<<<<<<< HEAD
                    className="page-link"
                    disabled={currentPage === pageNumbers.length}
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length));
                    }}
=======
                    disabled={currentPage === pageNumbers.length}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length))}
>>>>>>> 74533490aca3d8c574ad2b37a46c6bfc26fce5e0
                >
                    &raquo;
                </button>
            </div>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p className="text-muted">A simple note-taking app</p>
            </div>
        );
    }

    function renderNotes() {
        return (
            <div className="notes">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
                <Form className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Form>
                <ListGroup>{!isLoading && renderNotesList(filteredNotes)}</ListGroup>
                {!isLoading && renderPagination()}
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> 74533490aca3d8c574ad2b37a46c6bfc26fce5e0
