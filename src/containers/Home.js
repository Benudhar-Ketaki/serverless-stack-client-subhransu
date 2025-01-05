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
    // const BASE_URL = "https://notes-api-uploads.s3.us-east-1.amazonaws.com";

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }
            try {
                const notes = await loadNotes();
                setNotes(notes);
                setFilteredNotes(notes); // Initialize filtered notes
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
        setCurrentPage(1); // Reset to the first page after search
    }

    function renderNotesList(notesToRender) {
        const indexOfLastNote = currentPage * notesPerPage;
        const indexOfFirstNote = indexOfLastNote - notesPerPage;
        const currentNotes = notesToRender.slice(indexOfFirstNote, indexOfLastNote);
        // const safeContent = typeof content === "string" ? content : "No content available";
        // const safeAttachment = typeof attachment === "string" ? attachment : null;

        // const filePath = private/${userId}/${safeAttachment};
        // const encodedKey = encodeURIComponent(filePath);
        // const imageUrl = ${BASE_URL};

        return (
            <>
                <LinkContainer to="/notes/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ml-2 font-weight-bold">Create a new note</span>
                    </ListGroup.Item>
                </LinkContainer>
                {currentNotes.map(({ noteId, content, createdAt }) => (
                    <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                        <ListGroup.Item action>
                            {/* {imageUrl && (
                                <img
                                    src={"/default-image.png"}
                                    alt={Note ${content.trim().split("\n")[0]}}
                                    className="note-image"
                                    onError={(e) => (e.target.src = "/default-image.png")}
                                />
                            )} */}
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
                <a
                    href="#"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    &laquo;
                </a>
                {pageNumbers.map((number) => (
                    <a
                        key={number}
                        href="#"
                        className={number === currentPage ? "active" : ""}
                        onClick={() => setCurrentPage(number)}
                    >
                        {number}
                    </a>
                ))}
                <a
                    href="#"
                    onClick={() =>
                        setCurrentPage((prev) =>
                            Math.min(prev + 1, pageNumbers.length)
                        )
                    }
                >
                    &raquo;
                </a>
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
}
