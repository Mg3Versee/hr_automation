// src/services/redux/hooks.ts
"use client";

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Typed Redux hooks for client components.
 * Import these instead of useDispatch/useSelector directly.
 *
 * Example:
 *   const dispatch = useAppDispatch();
 *   const { jobs } = useAppSelector((s) => s.dashboard);
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
