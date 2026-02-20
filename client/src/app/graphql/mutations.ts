import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
    mutation CreateTodo($input: CreateTodoInput!) {
        createTodo(input: $input) {
            id
            title
            completed
            completedAt
            createdAt
        }
    }
`;

export const UPDATE_TODO = gql`
    mutation UpdateTodo($input: UpdateTodoInput!) {
        updateTodo(input: $input) {
            id
            title
            completed
            completedAt
            createdAt
        }
    }
`;

export const DELETE_TODO = gql`
    mutation DeleteTodo($id: ID!) {
        deleteTodo(id: $id)
    }
`;

export const TOGGLE_TODO = gql`
    mutation ToggleTodo($id: ID!) {
        toggleTodo(id: $id) {
            id
            title
            completed
            completedAt
            createdAt
        }
    }
`;